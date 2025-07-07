import pandas as pd
from datetime import datetime
from src.utils.logger import get_logger

logger = get_logger()

def read_csv(filepath):
    """Lee un archivo CSV y devuelve un DataFrame de pandas."""
    try:
        df = pd.read_csv(filepath, index_col=False)
        logger.info(f"Leído correctamente: {filepath} ({len(df)} filas)")
        return df
    except Exception as e:
        logger.error(f"Error leyendo {filepath}: {e}")
        return pd.DataFrame()

def write_csv(df, filepath):
    """Guarda un DataFrame de pandas en un archivo CSV (sobrescribe)."""
    try:
        df.to_csv(filepath, index=False)
        logger.info(f"Guardado correctamente: {filepath} ({len(df)} filas)")
    except Exception as e:
        logger.error(f"Error guardando {filepath}: {e}")

def append_csv(df, filepath):
    """Añade registros a un CSV existente o lo crea si no existe. Loggea la acción."""
    try:
        write_header = not pd.io.common.file_exists(filepath)
        df['saved_at'] = datetime.now().isoformat()
        df.to_csv(filepath, mode='a', header=write_header, index=False)
        logger.info(f"Añadidos {len(df)} registros a {filepath}")
        print(f"[{datetime.now().isoformat()}] Añadidos {len(df)} registros a {filepath}")
    except Exception as e:
        logger.error(f"Error añadiendo registros a {filepath}: {e}")
        print(f"❌ Error añadiendo registros a {filepath}: {e}")