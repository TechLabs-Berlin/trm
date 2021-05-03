import * as React from "react";
import PropTypes from "prop-types";
import { SelectInput } from "react-admin";

export const DropOutSelectInput = ({ source, record = {}, ...rest}) => {
	return <SelectInput source={source} record={record} choices={[
    	{ id: "REGISTRATION_FORM", name: "Didn’t submit Registration form" },
		{ id: "PERSONALIZATION_FORM", name: "Didn’t submit Personalization form" },
		{ id: "PROJECT_FORM", name: "Didn’t submit Project Preference form" },
		{ id: "HATCHING_FAIL", name: "Didn’t pass the Hatching Phase" },
		{ id: "DROPPED_ACADEMY", name: "Dropped during Academy Phase" },
		{ id: "DROPPED_PROJECT", name: "Dropped during Project Phase" },
	]} {...rest} />
}

DropOutSelectInput.propTypes = {
	label: PropTypes.string,
	record: PropTypes.object,
	source: PropTypes.string.isRequired,
};

