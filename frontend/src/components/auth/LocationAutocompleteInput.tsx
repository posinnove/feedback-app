import AutoComplete from 'react-google-autocomplete';

interface Props {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    placeholder?: string;
    className?: string;
}

export default function LocationAutocompleteInput({
    value,
    onChange,
    onBlur,
    placeholder,
    className
}: Props) {
    return (
        <AutoComplete
            // Use the API key from your vite-env.d.ts configuration
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            onPlaceSelected={(place) => {
                // When a user clicks a suggestion, update the form with the full address
                onChange(place.formatted_address || '');
            }}
            options={{
                types: ['(cities)'], // Restrict to cities for cleaner data
            }}
            // Essential: Use 'value' to keep the text synced with Hook Form state
            value={value}
            onBlur={onBlur}
            placeholder={placeholder}
            className={className}
            // Ensure typing updates the form state immediately to prevent "locking"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChange(e.target.value);
            }}
            // Forces the input to stay interactive
            disabled={false}
        />
    );
}