import Link from 'next/link'
import styled from 'styled-components'
import { useRouter } from 'next/router'

export default function Header() {
  const { pathname } = useRouter()
  console.log(pathname, 'check pathname')
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '500px',
        padding: '1rem',
        margin: '1rem',
        overflow: 'auto',
        border: '1px solid',
        borderRadius: '1rem',
      }}
    >
      <HeaderLink className={pathname === '/' ? 'active' : ''}>
        <Link href="/">Multi wallet example</Link>
      </HeaderLink>

      <HeaderLink className={pathname === '/dapp' ? 'active' : ''}>
        <Link href="/dapp">Dapp wallet example</Link>
      </HeaderLink>
    </div>
  )
}

const HeaderLink = styled.div`
  margin-right: 20px;

  &:last-child {
    margin-right: 0;
  }

  a {
    text-decoration: underline;
    color: #000;
  }
  &.active {
    a {
      color: #1665e3;
      text-decoration: none;
    }
  }
`
