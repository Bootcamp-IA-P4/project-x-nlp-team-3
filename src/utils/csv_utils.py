import pandas as pd

def read_csv(filepath):
    """Lee un archivo CSV y devuelve un DataFrame de pandas."""
    try:
        df = pd.read_csv(filepath)
        print(f"Leído correctamente: {filepath} ({len(df)} filas)")
        return df
    except Exception as e:
        print(f"Error leyendo {filepath}: {e}")
        return pd.DataFrame()

def write_csv(df, filepath):
    """Guarda un DataFrame de pandas en un archivo CSV."""
    try:
        df.to_csv(filepath, index=False)
        print(f"Guardado correctamente: {filepath} ({len(df)} filas)")
    except Exception as e:
        print(f"Error guardando {filepath}: {e}")