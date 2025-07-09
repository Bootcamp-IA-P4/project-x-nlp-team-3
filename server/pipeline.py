import emoji
import nltk
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer


def preprocess_text(text):
    '''
    Función para preprocesar el texto
    '''
    # Convertir a minúsculas
    text = text.lower()
    # Eliminar URLs
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    # Convertir emojis a texto
    text = emoji.demojize(text)
    # Eliminar caracteres especiales y números
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\d+', '', text)
    # Tokenizar
    tokens = word_tokenize(text)
    # Eliminar stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]
    # Lematizar
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    # Unir tokens
    text = ' '.join(tokens)
    
    return text