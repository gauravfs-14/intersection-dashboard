import pandas as pd
import json
import sys
import os

# Mapping from original Excel header names to desired camelCase keys
COLUMN_MAPPING = {
    "id": "id",
    "Lat": "lat",
    "Lng": "lng",
    "Intersection": "intersection",
    "TxDOT District": "txdotDistrict",
    "City, State": "cityState",
    "County": "county",
    "On-System/Off-System": "onSystem",
    "Type": "type",
    "Status": "status",
    "Year Completed": "yearCompleted",
    "Previous Control Type": "previousControlType",
    "Approaches": "approaches",
    "Lane Type": "laneType",
    "ICD (ft)": "icdFt",
    "ICD (m)": "icdM",
    "Other Control Type": "otherControlType",
    "Comments": "comments"
}

def read_excel_file(filename: str) -> pd.DataFrame:
    # Read the first sheet of the Excel file
    df = pd.read_excel(filename)
    # Rename columns based on COLUMN_MAPPING
    df = df.rename(columns=COLUMN_MAPPING)
    return df

def preprocess_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Preprocess DataFrame to handle NaN and type conversions"""
    df = df.copy()
    
    # Handle ICD columns specially - replace NaN with -1
    icd_columns = ['icdFt', 'icdM']
    for col in icd_columns:
        if col in df.columns:
            df[col] = df[col].apply(lambda x: 
                -1 if pd.isna(x) or x == 'NaN'
                else int(x) if isinstance(x, (int, float)) and float(x).is_integer()
                else float(x) if isinstance(x, (int, float))
                else -1)
    
    # Handle year column specially - convert to int and replace NaN with -1
    if 'yearCompleted' in df.columns:
        df['yearCompleted'] = df['yearCompleted'].apply(lambda x:
            -1 if pd.isna(x) or x == 'NaN'
            else int(x) if isinstance(x, (int, float))
            else -1)
    
    # Handle string columns
    string_columns = [col for col in df.columns if col not in icd_columns + ['yearCompleted']]
    for col in string_columns:
        df[col] = df[col].apply(lambda x: None if pd.isna(x) else str(x))
    
    return df

def convert_df_to_json(df: pd.DataFrame) -> str:
    # Preprocess the DataFrame
    df = preprocess_dataframe(df)
    # Convert to records and then to JSON
    data = df.to_dict(orient="records")
    return json.dumps(data, indent=4)

def infer_ts_type(series: pd.Series) -> str:
    """
    Infer a TypeScript type for a given pandas Series.
    For simplicity:
      - If the column is numeric, return 'number'
      - Otherwise, return 'string'
    """
    if pd.api.types.is_numeric_dtype(series):
        return "number"
    else:
        return "string"

def generate_typescript_interface(df: pd.DataFrame, interface_name: str = "IntersectionData") -> str:
    """
    Generate a TypeScript interface definition based on the DataFrame columns.
    Columns that contain any null/None values are marked as optional.
    """
    lines = [f"interface {interface_name} {{"]
    
    # Use the order given by COLUMN_MAPPING values
    for orig, prop in COLUMN_MAPPING.items():
        if prop not in df.columns:
            continue  # skip if column not present
        
        series = df[prop]
        ts_type = infer_ts_type(series)
        # Mark as optional if any value in the column is missing
        optional = "?" if series.isnull().any() else ""
        lines.append(f"    {prop}{optional}: {ts_type};")
    
    lines.append("}")
    return "\n".join(lines)

def save_json_file(json_str: str, output_path: str) -> None:
    """Save JSON string to a file"""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        f.write(json_str)

def save_typescript_file(ts_interface: str, output_path: str) -> None:
    """Save TypeScript interface to a file"""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        f.write(ts_interface)

def main():
    if len(sys.argv) < 2:
        print("Usage: python convert_xlsx_dynamic.py input.xlsx")
        sys.exit(1)
    
    filename = sys.argv[1]
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    # Define output paths
    json_path = os.path.join(project_root, "src", "data", "intersections.json")
    types_path = os.path.join(project_root, "src", "types", "IntersectionData.ts")
    
    df = read_excel_file(filename)
    
    # Generate and save JSON output
    json_output = convert_df_to_json(df)
    save_json_file(json_output, json_path)
    print(f"JSON file saved to: {json_path}")
    
    # Generate and save TypeScript interface
    ts_interface = generate_typescript_interface(df)
    save_typescript_file(ts_interface, types_path)
    print(f"TypeScript interface saved to: {types_path}")

if __name__ == "__main__":
    main()
