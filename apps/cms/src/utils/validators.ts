type PayloadValidateArgs = {
    req: {
        locale?: string | null;
    };
};

export function requiredInVietnamese(message: string) {
    return (value: unknown, { req }: PayloadValidateArgs) => {
        if (req.locale === 'vi' && !value) {
            return message;
        }

        return true;
    };
}
