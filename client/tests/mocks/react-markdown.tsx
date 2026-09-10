type MarkdownProps = {
  children?: string
}

export default function MarkdownMock({ children }: MarkdownProps) {
  return <div>{children}</div>
}
