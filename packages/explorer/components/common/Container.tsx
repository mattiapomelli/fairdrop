import { FC, ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
}

const Container: FC<Props> = ({ title, children }) => {
  return (
    <div className="my-12 bg-container rounded-md">
      <div className="py-8 relative">
        <h1 className="mx-10 mb-8 text-2xl font-semibold">{title}</h1>
        {children}
      </div>
    </div>
  )
}

export default Container
