/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: contactsubmissions
 * Interface for ContactSubmissions
 */
export interface ContactSubmissions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  senderName?: string;
  /** @wixFieldType text */
  senderEmail?: string;
  /** @wixFieldType text */
  subject?: string;
  /** @wixFieldType text */
  messageContent?: string;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
}


/**
 * Collection ID: devotionals
 * Interface for Devotionals
 */
export interface Devotionals {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  content?: string;
  /** @wixFieldType date */
  publishDate?: Date | string;
  /** @wixFieldType text */
  author?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  featuredImage?: string;
}


/**
 * Collection ID: events
 * Interface for Events
 */
export interface Events {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  eventTitle?: string;
  /** @wixFieldType date */
  eventDate?: Date | string;
  /** @wixFieldType time */
  eventTime?: any;
  /** @wixFieldType text */
  eventDescription?: string;
  /** @wixFieldType text */
  location?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  eventImage?: string;
  /** @wixFieldType url */
  registrationUrl?: string;
}


/**
 * Collection ID: feedback
 * Interface for Feedback
 */
export interface Feedback {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  name?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  feedbackType?: string;
  /** @wixFieldType text */
  message?: string;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
}


/**
 * Collection ID: givingmethods
 * Interface for GivingMethods
 */
export interface GivingMethods {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  methodName?: string;
  /** @wixFieldType text */
  shortDescription?: string;
  /** @wixFieldType text */
  instructions?: string;
  /** @wixFieldType url */
  methodLink?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  qrCodeImage?: string;
  /** @wixFieldType boolean */
  isActive?: boolean;
}


/**
 * Collection ID: photogallery
 * Interface for PhotoGallery
 */
export interface PhotoGallery {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  image?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  eventName?: string;
  /** @wixFieldType date */
  dateTaken?: Date | string;
  /** @wixFieldType text */
  photographer?: string;
}


/**
 * Collection ID: sermons
 * Interface for Sermons
 */
export interface Sermons {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType url */
  youtubeUrl?: string;
  /** @wixFieldType date */
  sermonDate?: Date | string;
  /** @wixFieldType text */
  speakerName?: string;
  /** @wixFieldType text */
  description?: string;
}


/**
 * Collection ID: teambios
 * Interface for TeamBios
 */
export interface TeamBios {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  leaderName?: string;
  /** @wixFieldType text */
  role?: string;
  /** @wixFieldType text */
  biography?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  profilePhoto?: string;
  /** @wixFieldType text */
  ministry?: string;
  /** @wixFieldType text */
  email?: string;
}
