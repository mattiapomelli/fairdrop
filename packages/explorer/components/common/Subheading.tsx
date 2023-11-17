import { FC } from 'react'

interface Props {
  title: string
}

const Subheading: FC<Props> = ({ title }) => {
  return <h2 className="font-semibold">{title}</h2>
}

export default Subheading
