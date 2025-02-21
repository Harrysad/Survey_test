function GridSelect({ onSelect }) {
    const options = [
      { value: "", label: "Wybierz typ" },
      { value: "text", label: "Tekst" },
      { value: "checkbox", label: "Checkbox" },
      { value: "textarea", label: "Textarea" },
    ];
  
    const handleChange = (e) => {
      onSelect(e.target.value);
    };
  
    return (
      <select className="grid-select" onChange={handleChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
  
  export default GridSelect;