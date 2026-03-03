export interface FlowRequest {
    code: number;
    typeDocument: number;
    document: string;
    url: string;
    key: string;
    flowType: string;
    state: number;
    createFor: string;
    updateFor: string;
    valiteKey: string;
    amountRisk: number;
    customerId: number;
    callBackUrl: string;
    createDate: string;
    project: number;
}

export interface RequestPayload {
    limit?: number;
    search?: string;
    skip?: number;
}

export interface ListRequestsResponse {
    success: boolean;
    message: string;
    StatusCode: string;
    data: FlowRequest[]
    totalCount: number
}

export type RequestColumn = "id" | "document" | "status";
