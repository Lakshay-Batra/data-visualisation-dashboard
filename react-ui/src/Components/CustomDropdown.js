import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

function CustomDropdown({ selectedValue, options, handleSelctionChange }) {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {selectedValue}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {options.map((item, index) => (
          <Dropdown.Item key={index} onClick={() => handleSelctionChange(item)}>
            {item}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default CustomDropdown;
