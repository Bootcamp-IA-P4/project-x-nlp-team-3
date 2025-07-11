from server.database.db_connection import supabase

def save_comment(data_dict):
    try:
        print("Intentando guardar:", data_dict)
        response = supabase.table("predict_toxic").insert(data_dict).execute()
        print("Comentario guardado correctamente:", response.data)
        return response.data
    except Exception as e:
        print(f"❌ Error al guardar el comentario: {e}")
        return None