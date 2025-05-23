import { IDocument } from "./common"

export interface ContactUsRequest {
   name: string
   email: string
   phone: string
   pincode: string
   message: string
}

export interface Contact extends IDocument {
   name: string
   email: string
   phone: string
   pincode: string
   message: string
}

export interface ContactResponse {
   contacts: Contact[]
}