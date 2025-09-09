import React, {useEffect, useMemo} from "react";
import { Autocomplete, TextField } from "@mui/material";
import {useRef, useState} from "react";
import {TimeSelectProps} from "./types";

const styles = {
    listBox: {
        maxHeight: '21vh',
        overflow: 'overlay',
    }
}

const timeList = [...Array(60).keys()].map((key) => ({
    id: key,
    label: String(key).padStart(2, "0"),
}));

const TimeSelect = (props: TimeSelectProps) => {

    const {
        value: valueProps,
        label,
        maxTime = 59,
        disabled,
        onChange = () => {},
        getOptionDisabled,
    } = props;

    const [value, setValue] = useState(timeList[0]);
    const [inputValue, setInputValue] = useState("");

    const autocompleteRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (value && valueProps === value.id) return;

        setValue(timeList.find(({id}) => id === valueProps));
    }, [valueProps])

    const options = useMemo(() => {
        return timeList.filter((time) => time.id <= maxTime);
    }, [maxTime]);

    return (
        <Autocomplete
            disabled={disabled}
            ListboxProps={{style: styles.listBox}}
            options={options}
            disableClearable={true}
            value={value}
            getOptionDisabled={getOptionDisabled}
            noOptionsText={`Введите значение от 00 до ${String(maxTime).padStart(2, "0")}`}
            onClose={(e) => {
                e.stopPropagation();
                autocompleteRef.current?.blur();
            }}
            inputValue={inputValue}
            onChange={(_, newValue) => {
                autocompleteRef.current?.blur();
                onChange(newValue.id);
                setValue(newValue)
            }}
            onInputChange={(_, newInputValue) => {
                const filtered = newInputValue.replace(/\D/g, "").slice(0, 2);
                setInputValue(filtered);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    InputLabelProps={{shrink: true}}
                    inputRef={autocompleteRef}
                    label={label}
                />
            )}
        />
    );
};

export default TimeSelect;
