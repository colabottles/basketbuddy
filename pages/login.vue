<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: var(--spacing-md);
  box-sizing: border-box;
}

.auth-card {
  background-color: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  padding: var(--spacing-2xl);
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
}

.auth-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: var(--spacing-sm);
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-weight: 500;
  color: white;
  font-size: var(--font-size-sm);
}

.input {
  width: 100%;
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  background-color: rgba(15, 23, 42, 0.5);
  color: white;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.2);
}

.button-primary {
  width: 100%;
  height: 48px;
  margin-top: var(--spacing-md);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  box-sizing: border-box;
}

.button-primary:hover {
  background-color: var(--color-primary-dark);
}

.button-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: var(--spacing-xl);
  color: rgba(255, 255, 255, 0.7);
}

.auth-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.auth-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

/* Mobile portrait optimizations */
@media (max-width: 640px) {
  .auth-container {
    padding: var(--spacing-sm);
  }

  .auth-card {
    padding: var(--spacing-xl) var(--spacing-lg);
    max-width: 100%;
  }

  .auth-title {
    font-size: var(--font-size-2xl);
  }

  .auth-subtitle {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-lg);
  }

  .input {
    font-size: 16px;
    /* Prevents iOS zoom */
    padding: var(--spacing-sm) var(--spacing-md);
    height: 48px;
  }

  .form-group {
    margin-bottom: 0;
  }

  .auth-form {
    gap: var(--spacing-md);
  }
}

/* Extra small devices (iPhone SE, etc) */
@media (max-width: 375px) {
  .auth-card {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .auth-title {
    font-size: var(--font-size-xl);
  }
}

/* Safe area for iPhone notch */
@supports (padding: env(safe-area-inset-top)) {
  .auth-container {
    padding-top: max(var(--spacing-md), env(safe-area-inset-top));
    padding-bottom: max(var(--spacing-md), env(safe-area-inset-bottom));
    padding-left: max(var(--spacing-md), env(safe-area-inset-left));
    padding-right: max(var(--spacing-md), env(safe-area-inset-right));
  }
}
</style>