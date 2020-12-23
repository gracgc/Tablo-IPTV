export const required = (value) => {
    if (value) return undefined;
    return "Field is required";
};

export const requiredShort = (value) => {
    if (value) return undefined;
    return "!";
};


export const maxLengthCreator = (maxLength) => (value) => {
    if (value.length > maxLength) return `Max length is ${maxLength} symbols`;
    return undefined;
};

export const maxTime20 = (value) => {
    if (value <= 20 && 0 <= value) return undefined;
    return "Задайте от 0 до 20";
};

export const maxTime60 = (value) => {
    if (value < 60 && 0 <= value) return undefined;
    return "Задайте от 0 до 59";
};
