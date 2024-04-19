
import { createClient } from '@supabase/supabase-js';


const supabase = createClient('https://kftkvhpkwnfevbnjerrr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmdGt2aHBrd25mZXZibmplcnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzOTEwMTUsImV4cCI6MjAyNTk2NzAxNX0.dwx0u1VggkAvcZ_oVNshhOSlsSiqV-8-2OvtH42F12g');


async function saveLanguageSetting(userId, languageCode) {
    const { data, error } = await supabase
        .from('user_settings')
        .upsert({ user_id: userId, language_code: languageCode }, { onConflict: 'user_id' });
    
    if (error) {
        console.error('Error al guardar la configuración de idioma:', error.message);
    }
}


document.getElementById('save-language-btn').addEventListener('click', async () => {
    const userId = 'ID_DEL_USUARIO'; 
    const languageCode = document.getElementById('language-select').value;
    await saveLanguageSetting(userId, languageCode);
    alert('Configuración de idioma guardada correctamente');
});
