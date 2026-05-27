import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from '@/components/site/PageHero'
import { submitPublicEnquiry } from '@/lib/catalog'
import { useMemo, useState } from 'react'

import brochurePdf from '@/assets/Pdf/SHRAVANENTERPRISES.pdf'

const PUBLIC_BROCHURE_PATH = '/SHRAVANENTERPRISES.pdf'

const BROCHURE_FILE_NAME = 'SHRAVANENTERPRISES.pdf'

export const Route = createFileRoute('/brochure')({
	head: () => ({
		meta: [{ title: 'Brochure — Shravan Enterprises' }],
		links: [{ rel: 'canonical', href: '/brochure' }],
	}),
	component: RouteComponent,
})

function getSavedValue(key: string) {
	if (typeof window === 'undefined') return ''
	return window.localStorage.getItem(key) ?? ''
}

async function downloadPdf() {
	const tryPublic = async () => {
 		try {
 			const res = await fetch(PUBLIC_BROCHURE_PATH, { method: 'HEAD' })
 			if (res.ok) return PUBLIC_BROCHURE_PATH
 		} catch {
 			// ignore
 		}
 		return null
 	}

	const url = (await tryPublic()) ?? brochurePdf

	const a = document.createElement('a')
	a.href = url
	a.download = BROCHURE_FILE_NAME
	document.body.appendChild(a)
	a.click()
	a.remove()
}

function RouteComponent() {
	const initialValues = useMemo(() => {
		if (typeof window === 'undefined') {
			return { name: '', email: '' }
		}

		const params = new URLSearchParams(window.location.search)

		return {
			name: params.get('name') ?? getSavedValue('brochure_name'),
			email: params.get('email') ?? getSavedValue('brochure_email'),
		}
	}, [])

	const [loading, setLoading] = useState(false)
	const [sent, setSent] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)
		setError(null)

		const fd = new FormData(e.currentTarget)
		const name = String(fd.get('name') ?? '').trim()
		const email = String(fd.get('email') ?? '').trim()

		try {
			if (typeof window !== 'undefined') {
				window.localStorage.setItem('brochure_name', name)
				window.localStorage.setItem('brochure_email', email)
			}

			try {
				await submitPublicEnquiry({
					customer_name: name,
					company: '',
					mobile: '',
					email,
					subject: 'Brochure Request',
					message: `Requested Shravan Enterprises brochure: ${BROCHURE_FILE_NAME}`,
				})
			} catch {
				// Even if enquiry API fails, brochure download will continue.
			}

			downloadPdf()
			setSent(true)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unable to download brochure. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<PageHero
				eyebrow="Company Brochure"
				title="Download Shravan Enterprises Brochure"
				description="Get our complete company profile, FRP raw material range, vacuum infusion products, resins, chemicals, accessories, and stone-care solutions."
			/>

			<section className="py-20">
				<div className="container mx-auto px-6">
					<div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
						<div className="rounded-3xl border border-border bg-card p-8 shadow-card">
							<p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
								PDF Brochure
							</p>

							<h2 className="text-3xl font-bold text-foreground">
								SHRAVAN ENTERPRISES
							</h2>

							<p className="mt-4 text-muted-foreground">
								ISO 9001:2015 certified supplier of high-quality FRP raw materials
								for Italian marble, granite, composite, and industrial applications.
							</p>

							<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div className="rounded-2xl border border-border bg-secondary/40 p-4">
									<h3 className="font-semibold text-foreground">Product Range</h3>
									<p className="mt-2 text-sm text-muted-foreground">
										Fiber reinforcement, resins, chemicals, vacuum infusion,
										FRP accessories, and stone-care products.
									</p>
								</div>

								<div className="rounded-2xl border border-border bg-secondary/40 p-4">
									<h3 className="font-semibold text-foreground">Brochure File</h3>
									<p className="mt-2 text-sm text-muted-foreground">
										{BROCHURE_FILE_NAME}
									</p>
								</div>
							</div>

							<a
							href={PUBLIC_BROCHURE_PATH}
							onClick={async (e) => {
								e.preventDefault()
								try {
									const res = await fetch(PUBLIC_BROCHURE_PATH, { method: 'HEAD' })
									if (res.ok) {
										window.open(PUBLIC_BROCHURE_PATH, '_blank')
										return
									}
								} catch {
									// ignore
								}
								window.open(brochurePdf, '_blank')
							}}
							rel="noreferrer"
							className="mt-8 inline-flex rounded-xl border border-primary/30 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
						>
							Preview PDF
						</a>
						</div>

						<div className="rounded-3xl border border-border bg-card p-8 shadow-card">
							{sent ? (
								<div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 text-center">
									<h3 className="text-xl font-bold text-primary">
										Thank you!
									</h3>

									<p className="mt-2 text-sm text-muted-foreground">
										Your brochure download has started.
									</p>

									<button
										type="button"
										onClick={downloadPdf}
										className="mt-5 rounded-xl gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow"
									>
										Download Again
									</button>
								</div>
							) : (
								<form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
									<h3 className="text-2xl font-bold text-foreground">
										Download Brochure
									</h3>

									<p className="text-sm text-muted-foreground">
										Enter your details and the PDF will download instantly.
									</p>

									<input
										name="name"
										defaultValue={initialValues.name}
										required
										maxLength={100}
										placeholder="Full Name"
										className="rounded-xl border border-border bg-secondary/50 px-4 py-3 outline-none transition focus:border-primary"
									/>

									<input
										name="email"
										defaultValue={initialValues.email}
										required
										type="email"
										maxLength={255}
										placeholder="Email Address"
										className="rounded-xl border border-border bg-secondary/50 px-4 py-3 outline-none transition focus:border-primary"
									/>

									{error ? (
										<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
											{error}
										</div>
									) : null}

									<button
										type="submit"
										disabled={loading}
										className="rounded-xl gradient-primary py-3 font-semibold text-primary-foreground shadow-glow disabled:cursor-not-allowed disabled:opacity-70"
									>
										{loading ? 'Please wait...' : 'Download PDF'}
									</button>
								</form>
							)}
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
