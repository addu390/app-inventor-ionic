export class ComponentField {
    // Action component will not use value
    public app_id: string;
    public component_id: string;
    public uuid: string;
    public header: string;
    public component_type: number;
    
    public values: string;
    
    // For Radio and multi select
    public options: string[];
    
    // For input strings
    public regex: string;
    
    // For text input and text-area
    public placeholder: string;
    
    // Sub categories in a input field (If exists)
    public input_type: number;
    
    // Action field for a component (Usually a button)
    public action: ActionField;
}

export class ActionField {
    public url: string;
    public request_type: string;
    public body: string;
    public query_params: any;
    public headers: any;
}