export interface AddCustomer {
    phone: string;
    pin: string;
}

export interface Redeem {
    invoice_id: string;
    phone: string;
    pin: string;
}

export interface AddPoint {
    phone: string,
    pin: string,
    point: number
}