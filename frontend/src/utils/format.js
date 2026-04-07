export function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString()
}

export function formatMoney(value) {
  if (value === undefined || value === null || value === '') return ''
  const n = Number(value)
  if (Number.isNaN(n)) return String(value)
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

export function applicationStatusVariant(status) {
  switch (status) {
    case 'Shortlisted':
      return 'warning'
    case 'Rejected':
      return 'danger'
    case 'Selected':
      return 'success'
    default:
      return 'neutral'
  }
}

