// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Chip from '@mui/material/Chip'

import {useSession} from '~/auth'
import FindKeyword, {Keyword} from '~/components/keyword/FindKeyword'
import {softwareInformation as config} from '../editSoftwareConfig'
import {searchForSoftwareKeyword} from './searchForSoftwareKeyword'
import {KeywordForSoftware} from '~/types/SoftwareTypes'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ImportKeywordsFromDoi from './ImportKeywordsFromDoi'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {addKeywordsToSoftware, createKeyword, deleteKeywordFromSoftware} from '~/utils/editKeywords'
import {sortOnStrProp} from '~/utils/sortFn'

type SoftwareKeywordsProps={
  software_id:string,
  items: KeywordForSoftware[]
  concept_doi?:string
}

export default function AutosaveSoftwareKeywords({software_id, items, concept_doi}:SoftwareKeywordsProps){
  const {token} = useSession()
  const {showErrorMessage, showInfoMessage} = useSnackbar()
  const [keywords, setKeywords] = useState(items)

  // console.group('SoftwareKeywords')
  // console.log('fields...', fields)
  // console.groupEnd()

  async function onAdd(selected: Keyword) {
    // check if already added
    const find = keywords.filter(item => item.keyword === selected.keyword)
    let resp
    if (find.length === 0) {
      resp = await addKeywordsToSoftware({
        data:{software:software_id, keyword: selected.id},
        token
      })
      if (resp.status===200){
        const items = [
          ...keywords,
          {
            ...selected,
            software:software_id
          }
        ].sort((a,b)=>sortOnStrProp(a,b,'keyword'))
        setKeywords(items)
      }else{
        showErrorMessage(`Failed to save keyword. ${resp.message}`)
      }
    }else{
      showInfoMessage(`${selected.keyword} is already in the list`)
    }
  }

  async function onCreate(selected: string) {
    // check if already exists
    const find = keywords.filter(item => item.keyword === selected)
    if (find.length === 0) {
      // create keyword
      let resp = await createKeyword({
        keyword: selected,
        token
      })
      if (resp.status===201){
        const keyword = {
          id: resp.message as string,
          keyword: selected,
          software: software_id,
          cnt: null
        }
        // add keyword after created
        await onAdd(keyword)
      }else{
        showErrorMessage(`Failed to save keyword. ${resp.message}`)
      }
    }else{
      showInfoMessage(`${selected} is already in the list`)
    }
  }

  async function onRemove(pos:number) {
    const item = keywords[pos]
    if (item.software && item.id){
      const resp = await deleteKeywordFromSoftware({
        software: item.software,
        keyword: item.id,
        token
      })
      if (resp.status===200){
        const items=[
          ...keywords.slice(0,pos),
          ...keywords.slice(pos+1)
        ]
        setKeywords(items)
      }else{
        showErrorMessage(`Failed to delete keyword. ${resp.message}`)
      }
    }
  }

  return (
    <>
      <EditSectionTitle
        title={config.keywords.title}
        subtitle={config.keywords.subtitle}
      />
      <div className="flex flex-wrap py-2">
      {keywords.map((item, pos) => {
        return(
          <div
            key={item.id}
            className="py-1 pr-1"
          >
            <Chip
              title={item.keyword}
              label={item.keyword}
              onDelete={() => onRemove(pos)}
            />
          </div>
        )
      })}
      </div>
      <FindKeyword
        config={{
          freeSolo: false,
          minLength: config.keywords.validation.minLength,
          label: config.keywords.label,
          help: config.keywords.help,
          reset: true
        }}
        searchForKeyword={searchForSoftwareKeyword}
        onAdd={onAdd}
        onCreate={onCreate}
      />
      {
        concept_doi &&
        <div className="pt-4 pb-0">
          <ImportKeywordsFromDoi
            software_id={software_id}
            concept_doi={concept_doi}
            keywords={keywords}
            onSetKeywords={setKeywords}
          />
        </div>
      }
    </>
  )
}
