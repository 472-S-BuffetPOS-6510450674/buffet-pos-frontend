export interface EditPricePerPersonRequest {
    price: number;
}

export interface EditPricePerGramRequest {
    price_fee_food_overweight: number;
}

export interface SettingResponse {
    key: string;
    value: string;
}