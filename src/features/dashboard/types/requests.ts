export interface FlowRequest {
    id: string;
    createdAt: string;
    docType: string;
    document: string;
    key: string;
    url: string;
    status: string;
}

export interface ListRequestsPayload {
    attributesToGet?: string;
    search?: string;
    column?: string;
    filter?: string;
    limit?: number;
    skip?: number;
}

export interface ListRequestsResponse {
    success: boolean;
    message: string | { error: string };
    StatusCode: string;
    data: {
        requests: FlowRequest[];
    };
}

export type RequestColumn = "id" | "document" | "status";
