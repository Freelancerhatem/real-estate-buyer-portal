/**
 * Types aligned with your backend.
 * - Inquiry status matches your Mongoose schema.
 * - Property fields are minimal (you populate title, images, propertyType).
 * - Optional fields included for richer UIs if you add them later.
 */

export type InquiryStatus = "pending" | "assigned" | "resolved";

export type MessageFrom = "buyer" | "seller" | "agent" | "system";
export type TimelineKind = "message" | "visit" | "offer" | "status" | "doc";

export interface Message {
    id: string;
    from: MessageFrom;
    text: string;
    at: string; // ISO
}

export interface TimelineEvent {
    id: string;
    kind: TimelineKind;
    title: string;
    at: string; // ISO
    meta?: Record<string, unknown>;
}

export interface PropertySummary {
    id: string;
    title: string;
    propertyType?: string;
    images?: string[];
    thumbnail: string; // derived: first image or placeholder
    status: InquiryStatus; // mirror inquiry.status so we can badge in the list
}

export interface AssignedUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface Inquiry {
    id: string;
    createdAt: string;

    // From populate on property
    property: PropertySummary;

    // Buyer/inquirer fields from your schema
    inquirerName?: string;  // `name` in your model
    inquirerEmail?: string; // `email` in your model
    initialMessage?: string;

    // From populate on assignedTo
    assignedTo?: AssignedUser;

    // Optional for richer inbox experiences
    lastMessageSnippet?: string;
    lastMessageAt?: string;
}
