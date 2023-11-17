export const formatAddress = (address: string) =>
  `${address.toLowerCase().slice(0, 6)}...${address
    .toLowerCase()
    .slice(address.length - 4, address.length)}`

export const formatUnixTimestamp = (unixTimestamp: number) => {
  const timestampTime: Date = new Date(unixTimestamp * 1000) // Convert Unix timestamp to milliseconds

  const formattedDate: string = timestampTime.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    timeZoneName: 'short',
  })

  const currentTime: Date = new Date()
  const timeDifference: number =
    (currentTime.getTime() - timestampTime.getTime()) / 1000

  if (timeDifference < 60)
    return `${Math.floor(timeDifference)} seconds ago (${formattedDate})`
  else if (timeDifference < 3600) {
    const minsAgo: number = Math.floor(timeDifference / 60)
    return `${minsAgo} min${minsAgo !== 1 ? 's' : ''} ago (${formattedDate})`
  } else if (timeDifference < 86400) {
    const hrsAgo: number = Math.floor(timeDifference / 3600)
    const minsAgo: number = Math.floor((timeDifference % 3600) / 60)
    return `${hrsAgo} hr${minsAgo === 1 ? '' : 's'} ${
      minsAgo > 0 && minsAgo === 1 ? ` ${minsAgo} min` : ` ${minsAgo} mins`
    } ago (${formattedDate})`
  } else return `(${formattedDate})`
}

export const formatNumber = (s: number) => {
  try {
    return s.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } catch (_) {
    return 0
  }
}
