import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { MODULES, UI_BLOCKS } from './catalog-data';
import styles from './compositor.module.css';

interface Props {
  selectedModules: Set<string>;
  selectedUIBlocks: Set<string>;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm({ selectedModules, selectedUIBlocks }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedModuleNames = MODULES.filter(m => selectedModules.has(m.id)).map(m => m.name);
  const selectedBlockNames = UI_BLOCKS.filter(b => selectedUIBlocks.has(b.id)).map(b => b.name);
  const configText = [
    selectedModuleNames.length ? `Moduły: ${selectedModuleNames.join(', ')}` : '',
    selectedBlockNames.length ? `UI Bloki: ${selectedBlockNames.join(', ')}` : '',
  ].filter(Boolean).join('\n');

  const validate = (data: FormData): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!data.get('name')) errs.name = 'Wymagane';
    if (!data.get('email')) errs.email = 'Wymagane';
    else if (!/\S+@\S+\.\S+/.test(data.get('email') as string)) errs.email = 'Niepoprawny email';
    if (!data.get('company')) errs.company = 'Wymagane';
    if (!data.get('users')) errs.users = 'Wymagane';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const errs = validate(data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('submitting');
    try {
      await emailjs.sendForm(
        import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
        import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID,
        formRef.current!,
        { publicKey: import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY }
      );
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.formSuccess}>
        <div style={{ fontSize: '2rem' }}>🎉</div>
        <h3>Dziękujemy!</h3>
        <p>Odezwiemy się w ciągu 24h z Twoją spersonalizowaną konfiguracją.</p>
      </div>
    );
  }

  return (
    <div className={styles.contactForm}>
      <h3 className={styles.formTitle}>Zamów demo z Twoją konfiguracją</h3>
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label htmlFor="cf-name">Imię i nazwisko *</label>
            <input id="cf-name" name="name" type="text" className={errors.name ? styles.inputError : ''} />
            {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
          </div>
          <div className={styles.formField}>
            <label htmlFor="cf-email">Email firmowy *</label>
            <input id="cf-email" name="email" type="email" className={errors.email ? styles.inputError : ''} />
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label htmlFor="cf-company">Nazwa firmy *</label>
            <input id="cf-company" name="company" type="text" className={errors.company ? styles.inputError : ''} />
            {errors.company && <span className={styles.errorMsg}>{errors.company}</span>}
          </div>
          <div className={styles.formField}>
            <label htmlFor="cf-users">Liczba użytkowników *</label>
            <select id="cf-users" name="users" defaultValue="" className={errors.users ? styles.inputError : ''}>
              <option value="" disabled>Wybierz...</option>
              <option value="1-50">1–50</option>
              <option value="50-200">50–200</option>
              <option value="200-1000">200–1 000</option>
              <option value="1000+">1 000+</option>
            </select>
            {errors.users && <span className={styles.errorMsg}>{errors.users}</span>}
          </div>
        </div>
        <div className={styles.formField}>
          <label htmlFor="cf-message">Wiadomość (opcjonalnie)</label>
          <textarea id="cf-message" name="message" rows={3} />
        </div>
        <div className={styles.formField}>
          <label>Twoja konfiguracja</label>
          <textarea name="configuration" readOnly value={configText} className={styles.configReadOnly} rows={3} />
        </div>
        <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Wysyłanie...' : 'Wyślij konfigurację →'}
        </button>
        {status === 'error' && (
          <p className={styles.errorMsg} style={{ marginTop: '8px', textAlign: 'center' }}>
            Błąd wysyłki. Spróbuj ponownie lub napisz bezpośrednio.
          </p>
        )}
      </form>
    </div>
  );
}
