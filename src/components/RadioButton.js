import React from "react";

const RadioButton = ({ label, name, checked, onChange }) => {
	return (
		<label className="inline-flex items-center cursor-pointer">
			<input
				type="radio"
				className="form-radio text-indigo-600 h-5 w-5 cursor-pointer"
				name={name}
				checked={checked}
				onChange={onChange}
			/>
			<span
				className="ml-2 text-gray-700 font-semibold"
				dangerouslySetInnerHTML={{ __html: label }}
			/>
		</label>
	);
};

export default RadioButton;
