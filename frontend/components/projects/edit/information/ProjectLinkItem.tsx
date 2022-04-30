import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

import {useFormContext, useWatch} from 'react-hook-form'

import ControlledTextInput from '~/components/form/ControlledTextInput'
import {EditProject, ProjectLink} from '~/types/Project'
import {useEffect} from 'react'
import {projectInformation as config} from './config'

export type ProjectLinkProps = {
  id: string,
  remove: any
  register: any
  control: any
  pos: number
  defaultValue: ProjectLink,
}

export default function ProjectLinkItem({register, control, remove, pos, id, defaultValue}: ProjectLinkProps) {
  const {formState: {errors}} = useFormContext<EditProject>()

  // console.group(`ProjectLinkItem...${pos}`)
  // console.log('errors...', errors)
  // console.log('linkItem...', link)
  // console.log('title state...', getFieldState(`url_for_project.${pos}.title`))
  // console.log('url state...', getFieldState(`url_for_project.${pos}.url`))
  // console.log('defaultValue...', defaultValue)
  // console.groupEnd()

  return (
    <div className="flex pb-8">
      <div className="flex-1">
        {/* <input type="hidden"
          {...register(`url_for_project.${pos}.status`)}
        /> */}
        <input type="hidden"
          value={pos}
          {...register(`url_for_project.${pos}.position`, {
            required:'position is required'
          })}
        />
        <input type="hidden"
          value={id}
          {...register(`url_for_project.${pos}.id`, {
            required: true
          })}
        />
        <input type="hidden"
          {...register(`url_for_project.${pos}.uuid`, {
            required: false
          })}
        />
        <input type="hidden"
          {...register(`url_for_project.${pos}.project`, {
            required: true
          })}
        />
        <ControlledTextInput
          name={`url_for_project.${pos}.title`}
          defaultValue={defaultValue.title}
          control={control}
          rules={config.url_for_project.title.validation}
          muiProps={{
            autoFocus: defaultValue.title === null,
            autoComplete: 'off',
            placeholder: config.url_for_project.title.placeholder,
            variant: 'standard',
            sx: {
              width: '100%',
            },
            helperText: errors?.url_for_project?.[pos]?.title ? errors?.url_for_project?.[pos]?.title?.message : config.url_for_project.title.label,
            error: errors?.url_for_project?.[pos]?.title ? true : false
          }}
        />
        <ControlledTextInput
          name={`url_for_project.${pos}.url`}
          defaultValue={defaultValue.url}
          control={control}
          rules={config.url_for_project.url.validation}
          muiProps={{
            autoComplete:'off',
            variant: 'standard',
            placeholder: config.url_for_project.url.placeholder,
            sx: {
              width: '100%'
            },
            helperText: errors?.url_for_project?.[pos]?.url ? errors?.url_for_project?.[pos]?.url?.message : config.url_for_project.url.label,
            error: errors?.url_for_project?.[pos]?.url ? true : false
          }}
        />
      </div>
      <div className="pl-4">
        <IconButton
          title="Remove project link"
          onClick={()=>remove(pos)}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  )
}
