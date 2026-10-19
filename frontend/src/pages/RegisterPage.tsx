import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ErrorNote } from '../components/ui/Feedback'
import { Field, Input } from '../components/ui/Field'

export function RegisterPage() {
  const { t } = useTranslation()
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<unknown>(null)

  const schema = z.object({
    firstName: z.string().min(1, t('auth.validation.firstNameMin')).max(80),
    lastName: z.string().min(1, t('auth.validation.lastNameMin')).max(80),
    documentId: z.string().min(1, t('auth.validation.documentIdMin')).max(40),
    phone: z.string().max(40).optional(),
    email: z.email(t('auth.validation.emailInvalid')).max(160),
    password: z
      .string()
      .min(8, t('auth.validation.passwordMin'))
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, t('auth.validation.passwordPattern')),
  })
  type FormValues = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setServerError(null)
    try {
      await registerUser(values)
      navigate('/account', { replace: true })
    } catch (error) {
      setServerError(error)
    }
  }

  const field = (
    id: keyof FormValues,
    label: string,
    type = 'text',
    autoComplete?: string,
    hint?: string,
  ) => (
    <Field id={id} label={label} hint={hint} error={errors[id]?.message}>
      <Input type={type} required={id !== 'phone'} autoComplete={autoComplete} {...register(id)} />
    </Field>
  )

  return (
    <div className="reticula flex min-h-[70vh] items-center justify-center px-4 py-12 sm:py-16">
      <Card variant="brand" className="w-full max-w-lg p-6 sm:p-8">
        <h1 className="font-display text-center text-2xl text-tinta-900">{t('auth.register.title')}</h1>
        <p className="mt-1 text-center text-sm text-tinta-600">{t('auth.register.subtitle')}</p>
        <div className="separador mx-auto mt-4 mb-6 max-w-45 text-xs">
          <span aria-hidden>◆</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {field('firstName', t('auth.register.firstName'), 'text', 'given-name')}
            {field('lastName', t('auth.register.lastName'), 'text', 'family-name')}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {field('documentId', t('auth.register.documentId'), 'text', 'off')}
            {field('phone', `${t('auth.register.phone')} (${t('common.optional')})`, 'tel', 'tel')}
          </div>
          {field('email', t('auth.register.email'), 'email', 'email')}
          {field('password', t('auth.register.password'), 'password', 'new-password', t('auth.register.passwordHint'))}

          {serverError != null && <ErrorNote error={serverError} />}

          <Button type="submit" loading={isSubmitting} className="w-full">
            {isSubmitting ? t('auth.register.submitting') : t('auth.register.submit')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-tinta-600">
          {t('auth.register.hasAccount')}{' '}
          <Link to="/login" className="font-semibold text-fez-700 underline underline-offset-2 hover:text-fez-800">
            {t('auth.register.login')}
          </Link>
        </p>
      </Card>
    </div>
  )
}
