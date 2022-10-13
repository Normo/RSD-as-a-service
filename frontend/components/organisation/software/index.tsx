// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'

import {useSession} from '~/auth'
import useOrganisationSoftware from '../../../utils/useOrganisationSoftware'
import usePaginationWithSearch from '../../../utils/usePaginationWithSearch'
import FlexibleGridSection from '~/components/layout/FlexibleGridSection'
import SoftwareCard from '~/components/software/SoftwareCard'
import NoContent from '~/components/layout/NoContent'
import {OrganisationComponentsProps} from '../OrganisationNavItems'
import SoftwareCardWithMenu from './SoftwareCardWithMenu'

export default function OrganisationSoftware({organisation, isMaintainer}: OrganisationComponentsProps) {
  const {token} = useSession()
  const {searchFor,page,rows,setCount} = usePaginationWithSearch('Filter software')
  const {loading, software, count} = useOrganisationSoftware({
    organisation: organisation.id,
    searchFor,
    page,
    rows,
    isMaintainer,
    token
  })
  // use media query hook for small screen logic
  const smallScreen = useMediaQuery('(max-width:600px)')
  // adjust grid min width for mobile to 18rem
  const minWidth = smallScreen ? '18rem' : '26rem'

  useEffect(() => {
    if (count && loading === false) {
      setCount(count)
    }
  },[count,loading,setCount])

  if (software.length === 0
    && loading === false) {
    // show nothing to show message
    // if no items and loading is completed
    return <NoContent />
  }

  return (
    <FlexibleGridSection
      className="gap-[0.125rem] p-[0.125rem] pt-2 pb-12"
      height='17rem'
      minWidth={minWidth}
      maxWidth='1fr'
    >
      {software.map(item => {
        if (isMaintainer) {
          return(
            <SoftwareCardWithMenu
              key={item.id}
              organisation={organisation}
              item={item}
              token={token}
            />
          )
        }
        return(
          <SoftwareCard
            key={`/software/${item.slug}/`}
            href={`/software/${item.slug}/`}
            {...item}
          />
        )
      })}
    </FlexibleGridSection>
  )
}
