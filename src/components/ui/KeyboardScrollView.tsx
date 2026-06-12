import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewProps,
} from 'react-native';

/**
 * ScrollView con manejo automático de teclado: cuando aparece el teclado y
 * el input enfocado quedaría tapado, la pantalla se desplaza sola para
 * mantenerlo visible. Úsalo SIEMPRE en pantallas con inputs de texto.
 *
 * - iOS: `automaticallyAdjustKeyboardInsets` ajusta los insets nativos.
 * - Android: KeyboardAvoidingView con behavior='height' aplica padding.
 */
export function KeyboardScrollView({ children, ...rest }: ScrollViewProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        automaticallyAdjustContentInsets={false}
        {...rest}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
