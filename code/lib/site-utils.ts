import siteData from "./site-data.json"

export interface SiteGeneralInfo {
  title: string
  subtitle: string
  note: string
}

export interface SiteData {
  general: SiteGeneralInfo
}

export const siteConfig: SiteData = siteData as SiteData

export const getGeneralInfo = (): SiteGeneralInfo => siteConfig.general


