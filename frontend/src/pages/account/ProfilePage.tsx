import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useMyProfile, useUpdateProfile } from '../../api/hooks/useMe'
import { ErrorNote, ListSkeleton } from '../../components/ui/Feedback'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Field, Input } from '../../components/ui/Field'
import { useToast } from '../../components/ui/toast-context'
import { useLabels } from '../../lib/labels'

export default function ProfilePage() {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const toast = useToast()

  const schema = z.object({
    firstName: z.string().min(1, t('auth.validation.firstNameMin')).max(80),
    lastName: z.string().min(1, t('auth.validation.lastNameMin')).max(80),
    birthDate: z.string().optional(),
    phone: z.string().max(40).optional(),
    address: z.string().max(200).optional(),
  })
  type FormValues = z.infer<typeof schema>

  const { data: profile, isPending, error, refetch } = useMyProfile()

  const save = useUpdateProfile(() => toast.success(t('account.profileSaved')))

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: profile
      ? {
          firstName: profile.firstName,
          lastName: profile.lastName,
          birthDate: profile.birthDate ?? '',
          phone: profile.phone ?? '',
          address: profile.address ?? '',
        }
      : undefined,
  })

  if (isPending) return <ListSkeleton rows={2} />
  if (error) return <ErrorNote error={error} onRetry={() => refetch()} />

  return (
    <div className="max-w-xl">
      <h2 className="sr-only">{t('account.profile.title')}</h2>
      <Card className="p-5 sm:p-6">
        <form onSubmit={handleSubmit((values) => save.mutate({ ...values, birthDate: values.birthDate || null }))} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="firstName" label={t('auth.register.firstName')} error={errors.firstName?.message}>
              <Input required autoComplete="given-name" {...register('firstName')} />
            </Field>
            <Field id="lastName" label={t('auth.register.lastName')} error={errors.lastName?.message}>
              <Input required autoComplete="family-name" {...register('lastName')} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="birthDate" label={`${t('account.profile.birthDate')} (${t('common.optional')})`}>
              <Input type="date" autoComplete="bday" {...register('birthDate')} />
            </Field>
            <Field id="phone" label={`${t('auth.register.phone')} (${t('common.optional')})`}>
              <Input type="tel" autoComplete="tel" {...register('phone')} />
            </Field>
          </div>
          <Field id="address" label={`${t('account.profile.address')} (${t('common.optional')})`}>
            <Input autoComplete="street-address" {...register('address')} />
          </Field>

          <div className="rounded-(--radius-control) bg-cal-100 px-4 py-3 text-sm text-tinta-600">
            <dl className="flex flex-wrap gap-x-2">
              <dt className="font-semibold text-tinta-900">{t('auth.register.documentId')}:</dt>
              <dd className="cifras">{profile.documentId}</dd>
              <dt className="ml-3 font-semibold text-tinta-900">{t('account.profile.type')}:</dt>
              <dd>{tLabel('clientType', profile.clientType)}</dd>
            </dl>
            <p className="mt-1">{t('account.profile.documentHint')}</p>
          </div>

          {save.error && <ErrorNote error={save.error} />}

          <Button type="submit" loading={isSubmitting || save.isPending}>
            {save.isPending ? t('account.profile.saving') : t('common.save')}
          </Button>
        </form>
      </Card>
    </div>
  )
}
