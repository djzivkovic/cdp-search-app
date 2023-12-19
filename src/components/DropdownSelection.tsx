import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

interface DropdownSelectionProps {
    onSelect: (collateral: string) => void;
    options: string[];
    selectedValue: string | null;
}

const DropdownSelection: React.FC<DropdownSelectionProps> = (
    {
        onSelect,
        options,
        selectedValue
    }
) => {
  return (
    <div className="dropdown-container w-25">
        <Dropdown data-bs-theme="dark" className="w-100">
            <Dropdown.Toggle variant='dark' id="dropdown-toggle" className="w-100">
                {selectedValue}
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100">
                {
                    options.map((option) => (
                        <Dropdown.Item as="button" key={option} className="w-100"
                            onClick={() => onSelect(option)} active={selectedValue === option}>
                            {option} 
                        </Dropdown.Item>
                    ))
                }
            </Dropdown.Menu>
        </Dropdown>
    </div>
  );
};

export default DropdownSelection;
