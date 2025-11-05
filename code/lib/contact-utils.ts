import contactData from "./contact-data.json"

export interface ContactInfo {
  centerName: string
  address: string
  hotline: string
  hotlineDisplay: string
  email: string
  website: string
}

export interface RegistrationInfo {
  formUrl: string
  description: string
  disclaimer: string
}

export interface MapInfo {
  embedUrl: string
  title: string
}

export interface ContactData {
  contact: ContactInfo
  registration: RegistrationInfo
  map: MapInfo
}

export const contactConfig: ContactData = contactData as ContactData

export const getContactInfo = (): ContactInfo => contactConfig.contact
export const getRegistrationInfo = (): RegistrationInfo => contactConfig.registration
export const getMapInfo = (): MapInfo => contactConfig.map

