import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

describe('Page', () => {
  it('renders the Next.js logo image', () => {
    render(<Page />)

    const nextImage = screen.getByAltText('Next.js logo')
    expect(nextImage).toBeInTheDocument()
  })

  it('renders the Vercel logomark image', () => {
    render(<Page />)

    const vercelImage = screen.getByAltText('Vercel logomark')
    expect(vercelImage).toBeInTheDocument()
  })

  it('renders the footer images (Learn, Examples, Next.js)', () => {
    render(<Page />)

    expect(screen.getByAltText('File icon')).toBeInTheDocument()
    expect(screen.getByAltText('Window icon')).toBeInTheDocument()
    expect(screen.getByAltText('Globe icon')).toBeInTheDocument()
  })
})
