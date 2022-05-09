import {GetServerSidePropsContext} from 'next'
import Head from 'next/head'
import Link from 'next/link'

import {claimProjectMaintainerInvite} from '~/auth/api/authHelpers'
import {getAccountFromToken} from '~/auth/jwtUtils'
import ContentInTheMiddle from '~/components/layout/ContentInTheMiddle'
import DefaultLayout from '~/components/layout/DefaultLayout'
import PageErrorMessage from '~/components/layout/PageErrorMessage'
import PageTitle from '~/components/layout/PageTitle'

type InviteProjectMaintainerProps = {
  projectInfo: {
    slug: string,
    title: string,
  }|null,
  error: {
    status: number,
    message: string
  }|null
}

export default function InviteProjectMaintainer({projectInfo, error}:
  InviteProjectMaintainerProps) {

  // console.group('InviteProjectMaintainer')
  // console.log('projectInfo..', projectInfo)
  // console.log('error..', error)
  // console.groupEnd()

  function renderContent() {
    if (error!==null) {
      return (
        <PageErrorMessage {...error}/>
      )
    }
    return (
      <ContentInTheMiddle>
        <h2>
          You are maintainer of {projectInfo?.title ?? 'missing'}!
          &nbsp;
          <Link href={`/projects/${projectInfo?.slug ?? 'missing'}`}>
            <a>
              Open project
            </a>
          </Link>
        </h2>
      </ContentInTheMiddle>
    )
  }

  return (
     <DefaultLayout>
      <Head>
        <title>Project Maintainer Invite | RSD</title>
      </Head>
      <PageTitle title="Project Maintainer Invite" />
      {renderContent()}
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // extract from page-query
  const {params,req} = context
  // extract rsd_token
  const token = req?.cookies['rsd_token']
  // extract id
  const id = params?.id

  // extract account id from token
  const account = getAccountFromToken(token)
  // console.log('account...', account)
  if (typeof account == 'undefined') {
    return {
      props: {
        projectInfo: null,
        error: {
          status: 401,
          message: 'You need to sign in to RSD first!'
        }
      }
    }
  }

  if (id) {
    // claim the project maintainer invite
    const projectInfo = await claimProjectMaintainerInvite({id: id.toString(), token, frontend: false})
    console.log(`invite ${id} ...projectInfo...`, projectInfo)
    if (typeof projectInfo == 'undefined') {
      // request failed
      // multiple reasons possible: id is mailformed, invite already claimed etc
      return {
        props: {
          projectInfo: null,
          error: {
            status: 400,
            message: 'This invite is invalid, expired or already claimed. Please ask the project mantainer to provide you a new link.'
          }
        }
      }
    }
    // pass project info to page component as props
    return {
      props: {
        projectInfo,
        error: null
      }
    }
  } else {
    return {
      props: {
        projectInfo:null,
        error: {
          status: 404,
          message: 'This invite is invalid. It\'s missing invite id. Please ask the project mantainer to provide you a new link.'
        }
      }
    }
  }
}
