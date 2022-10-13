// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState, useRef} from 'react'
import {useRouter} from 'next/router'
import Button from '@mui/material/Button'

import {useController, useFormContext} from 'react-hook-form'

import StickyHeader from '../../layout/StickyHeader'
import useStickyHeaderBorder from '~/components/layout/useStickyHeaderBorder'
import useProjectContext from './useProjectContext'

export default function EditProjectStickyHeader() {
  const {project} = useProjectContext()
  const router = useRouter()
  const {control} = useFormContext()
  const {field:{value:slug},fieldState:{error:slugError}} = useController({
    name: 'slug',
    control
  })
  const headerRef = useRef(null)
  const [classes, setClasses] = useState('')
  // add border when header is at the top of the page
  const {el} = useStickyHeaderBorder({
    headerRef, setClasses
  })

  // if (isDirty) {
  //   console.group('EditProjectStickyHeader')
  //   console.log('isDirty...', isDirty)
  //   console.log('isValid...', isValid)
  //   console.log('dirtyFields...', dirtyFields)
  //   console.groupEnd()
  // }

  return (
    <StickyHeader className={`md:flex py-4 w-full bg-white ${classes}`}>
      <h1
        ref={headerRef}
        className="flex-1 text-primary">
        {project?.title || ''}
      </h1>
      <div className="md:pl-8">
        <Button
          tabIndex={1}
          type="button"
          color="secondary"
          onClick={() => {
            // const slug = router.query['slug']
            router.push(`/projects/${slug}`)
            // complete page reload?
            // location.href=`/projects/${slug}`
          }}
          sx={{
            marginRight:'0.5rem'
          }}
          disabled={typeof slugError !=='undefined'}
        >
          VIEW PAGE
        </Button>
      </div>
    </StickyHeader>
  )
}
