export type BaseField = {
  name: string;
  label: string;
  optional?: boolean;
};

export type TextField = BaseField & {
  type:
    | "text"
    | "password"
    | "email"
    | "date"
    | "time"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "textarea";
  placeholder?: string;
};

export type SelectField = BaseField & {
  type: "select";
  options: string[];
  placeholder?: string;
};

export type Field = TextField | SelectField;
