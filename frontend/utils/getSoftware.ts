import {SoftwareItem} from '../types/SoftwareItem'
import {SoftwareCitationInfo} from '../types/SoftwareCitation'
import {extractCountFromHeader} from './extractCountFromHeader'
import logger from './logger'

/**
 * postgREST api uri to retreive software index data.
 * Note! url should contain all query params. Use softwareUrl helper fn to construct url.
 * @param url with all query params for search,filtering, order and pagination
 * @returns {
  * count:number,
  * data:[]
 * }
 */
export async function getSoftwareList(url:string){
  try{
    const headers = new Headers()
    // request count for pagination
    headers.append('Prefer','count=exact')
    const resp = await fetch(url,{method:'GET', headers})

    if ([200,206].includes(resp.status)){
      const data:SoftwareItem[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers),
        data
      }
    } else{
      logger(`getSoftwareList failed: ${resp.status} ${resp.statusText}`, 'warn')
      return {
        count:0,
        data:[]
      }
    }
  }catch(e:any){
    logger(`getSoftwareList: ${e?.message}`,'error')
    return {
      count:0,
      data:[]
    }
  }
}

// query for software item page based on slug
export async function getSoftwareItem(slug:string){
  try{
    // this request is always perfomed from backend
    const url = `${process.env.POSTGREST_URL}/software?select=*,repository_url!left(url)&slug=eq.${slug}`
    const resp = await fetch(url,{method:'GET'})
    if (resp.status===200){
      const data:SoftwareItem[] = await resp.json()
      return data[0]
    }
  }catch(e:any){
    logger(`getSoftwareItem: ${e?.message}`,'error')
  }
}

// Get
export type TagItem={
  count: number,
  tag:string,
  active:boolean
}
export async function getTagsWithCount(){
  try{
    // this request is always perfomed from backend
    const url = `${process.env.POSTGREST_URL}/count_software_per_tag?order=tag.asc`
    const resp = await fetch(url,{method:'GET'})
    if (resp.status===200){
      const data:TagItem[] = await resp.json()
      return data
    } else if (resp.status===404){
      logger(`getTagsWithCount: 404 [${url}]`,'error')
      // query not found
      return []
    }
  }catch(e:any){
    logger(`getTagsWithCount: ${e?.message}`,'error')
    return []
  }
}


/**
 * CITATIONS
 * @param uuid
 * @returns SoftwareCitationInfo
 */

export async function getCitationsForSoftware(uuid:string){
  try{
    // this request is always perfomed from backend
    // the release content is order by date_published
    const url = `${process.env.POSTGREST_URL}/release?select=*,release_content(*)&software=eq.${uuid}&release_content.order=date_published.desc`
    const resp = await fetch(url,{method:'GET'})
    if (resp.status===200){
      const data:SoftwareCitationInfo[] = await resp.json()
      return data[0]
    } else if (resp.status===404){
      logger(`getReleasesForSoftware: 404 [${url}]`,'error')
      // query not found
      return undefined
    }
  }catch(e:any){
    logger(`getReleasesForSoftware: ${e?.message}`,'error')
    return undefined
  }
}


/**
 * TAGS
 */

export type Tag = {
  software:string
  tag: string
}

export async function getTagsForSoftware(uuid:string){
  try{
    // this request is always perfomed from backend
    // the content is order by tag ascending
    const url = `${process.env.POSTGREST_URL}/tag_for_software?&software=eq.${uuid}&order=tag.asc`
    const resp = await fetch(url,{method:'GET'})
    if (resp.status===200){
      const data:Tag[] = await resp.json()
      return data
    } else if (resp.status===404){
      logger(`getTagsForSoftware: 404 [${url}]`,'error')
      // query not found
      return undefined
    }
  }catch(e:any){
    logger(`getTagsForSoftware: ${e?.message}`,'error')
    return undefined
  }
}

/**
 * LICENSE
 */

export type License = {
  id:string,
  software:string
  license: string
}

export async function getLicenseForSoftware(uuid:string){
  try{
    // this request is always perfomed from backend
    // the content is order by license ascending
    const url = `${process.env.POSTGREST_URL}/license_for_software?&software=eq.${uuid}&order=license.asc`
    const resp = await fetch(url,{method:'GET'})
    if (resp.status===200){
      const data:License[] = await resp.json()
      return data
    } else if (resp.status===404){
      logger(`getLicenseForSoftware: 404 [${url}]`,'error')
      // query not found
      return undefined
    }
  }catch(e:any){
    logger(`getLicenseForSoftware: ${e?.message}`,'error')
    return undefined
  }
}
