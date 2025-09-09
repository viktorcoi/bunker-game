export interface TimeSelectProps {
    disabled?: boolean;
    value: number;
    label?: string;
    maxTime?: number;
    onChange?(value: number): void;
    getOptionDisabled?(option: {id: number; label: string}): boolean;
}
