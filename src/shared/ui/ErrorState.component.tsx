interface Props {
  message?: string;
}

export function ErrorState({ message = 'Ошибка загрузки данных' }: Props) {
  return (
    <div className="text-center py-16 px-5 text-red-600">
      <div className="text-5xl mb-3">⚠️</div>
      <div className="text-lg font-semibold mb-2">{message}</div>
      <div className="text-sm">Проверьте подключение и попробуйте снова</div>
    </div>
  );
}