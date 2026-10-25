import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthContext'
import { homeFor } from '../auth/ProtectedRoute'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ErrorNote } from '../components/ui/Feedback'
import { Field, Input } from '../components/ui/Field'
import { Simbolo } from '../components/brand/Marca'

export function LoginPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState<unknown>(null)

  const schema = z.object({
    email: z.email(t('auth.validation.emailInvalid')),
    password: z.string().min(1, t('auth.validation.passwordRequired')),
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
      const user = await login(values.email, values.password)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? homeFor(user.role), { replace: true })
    } catch (error) {
      setServerError(error)
    }
  }

  const demo = [
    ['admin@hotel-erp.dev', 'Admin123!'],
    ['manager@hotel-erp.dev', 'Manager123!'],
    ['reception@hotel-erp.dev', 'Reception123!'],
    ['client@hotel-erp.dev', 'Client123!'],
  ]

  return (
    <div className="reticula flex min-h-[70vh] items-center justify-center px-4 py-12 sm:py-16">
      <Card variant="brand" className="w-full max-w-md p-6 sm:p-8">
        <Simbolo size={40} className="mx-auto mb-4 block text-fez-700" />
        <h1 className="font-display text-center text-2xl text-tinta-900">{t('auth.login.title')}</h1>
        <p className="mt-1 text-center text-sm text-tinta-600">{t('auth.login.subtitle')}</p>
        <div className="separador mx-auto mt-4 mb-6 max-w-45 text-xs">
          <span aria-hidden>◆</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Field id="email" label={t('auth.login.email')} error={errors.email?.message}>
            <Input type="email" required autoComplete="email" placeholder="tu@email.com" {...register('email')} />
          </Field>
          <Field id="password" label={t('auth.login.password')} error={errors.password?.message}>
            <Input type="password" required autoComplete="current-password" {...register('password')} />
          </Field>

          {serverError != null && <ErrorNote error={serverError} />}

          <Button type="submit" loading={isSubmitting} className="w-full">
            {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-tinta-600">
          {t('auth.login.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-fez-700 underline underline-offset-2 hover:text-fez-800">
            {t('auth.login.register')}
          </Link>
        </p>

        <div className="mt-6 rounded-(--radius-control) bg-cal-100 p-4 text-sm text-tinta-600">
          <p className="mb-2 font-semibold text-tinta-900">{t('auth.login.demoAccounts')}</p>
          <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1">
            {demo.map(([email, password]) => (
              <div key={email} className="contents">
                <dt className="truncate">{email}</dt>
                <dd className="cifras">{password}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Card>
    </div>
  )
}
