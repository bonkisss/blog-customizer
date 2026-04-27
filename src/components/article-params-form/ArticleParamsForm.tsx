import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';

import styles from './ArticleParamsForm.module.scss';
import {
	ArticleStateType,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
} from 'src/constants/articleProps';

type Props = {
	isOpen: boolean;
	onToggle: () => void;
	onClose: () => void;
	initialState: ArticleStateType; // текущее применённое состояние
	initialPageState: ArticleStateType;
	onApply: (s: ArticleStateType) => void;
	onReset: (s: ArticleStateType) => void;
};

/** Быстрая глубокая клонировка для state (удаляет ссылочные связи). */
const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const ArticleParamsForm = ({
	isOpen,
	onToggle,
	onClose,
	initialState,
	initialPageState,
	onApply,
	onReset,
}: Props) => {
	// Локальное состояние формы
	const [formState, setFormState] = useState<ArticleStateType>(
		deepClone(initialState)
	);

	// Когда открываем панель — инициализируем форму текущим применённым состоянием
	useEffect(() => {
		if (isOpen) {
			setFormState(deepClone(initialState));
		}
	}, [isOpen, initialState]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onApply(deepClone(formState));
	};

	// Сброс: откатываем к начальному состоянию страницы (initialPageState) и сразу применяем его
	const handleReset = (e?: React.SyntheticEvent) => {
		e?.preventDefault();
		const snap = deepClone(initialPageState);
		setFormState(snap);
		onReset(snap);
	};

	// --- handlers для контролов ---
	const handleFontFamilyChange = (
		option: (typeof fontFamilyOptions)[number]
	) => {
		setFormState((prev) => ({ ...prev, fontFamilyOption: option }));
	};

	const handleFontSizeChange = (option: (typeof fontSizeOptions)[number]) => {
		setFormState((prev) => ({ ...prev, fontSizeOption: option }));
	};

	const handleFontColorChange = (option: (typeof fontColors)[number]) => {
		setFormState((prev) => ({ ...prev, fontColor: option }));
	};

	const handleBgColorChange = (option: (typeof backgroundColors)[number]) => {
		setFormState((prev) => ({ ...prev, backgroundColor: option }));
	};

	const handleContentWidthChange = (
		option: (typeof contentWidthArr)[number]
	) => {
		setFormState((prev) => ({ ...prev, contentWidth: option }));
	};

	// Кнопка-опция для размера
	const SizeButton = ({
		option,
		selected,
		onSelect,
	}: {
		option: (typeof fontSizeOptions)[number];
		selected: boolean;
		onSelect: (o: (typeof fontSizeOptions)[number]) => void;
	}) => {
		const handleClick = () => onSelect(option);
		const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onSelect(option);
			}
		};

		return (
			<button
				type='button'
				className={clsx(styles.sizeOption, {
					[styles.sizeOption_selected]: selected,
				})}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				aria-pressed={selected}>
				{option.title}
			</button>
		);
	};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={onToggle} />
			{isOpen && <div className={styles.overlay} onClick={onClose} />}

			<aside
				className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<div style={{ marginBottom: 24 }}>
						<strong>Параметры статьи</strong>
					</div>

					{/* 1) Семья шрифта */}
					<div style={{ marginBottom: 18 }}>
						<Select
							title='Семья шрифта'
							selected={formState.fontFamilyOption}
							onChange={handleFontFamilyChange}
							options={fontFamilyOptions}
							placeholder='Выберите семью шрифта'
						/>
					</div>

					{/* 2) Размер шрифта — ряд кнопок */}
					<div style={{ marginBottom: 18 }}>
						<div style={{ marginBottom: 8 }}>
							<strong>Размер шрифта</strong>
						</div>
						<div
							className={styles.sizeOptions}
							role='radiogroup'
							aria-label='Выбор размера шрифта'>
							{fontSizeOptions.map((opt) => (
								<SizeButton
									key={opt.value}
									option={opt}
									selected={formState.fontSizeOption.value === opt.value}
									onSelect={handleFontSizeChange}
								/>
							))}
						</div>
					</div>

					{/* 3) Цвет текста — Select */}
					<div style={{ marginBottom: 18 }}>
						<Select
							title='Цвет текста'
							selected={formState.fontColor}
							onChange={handleFontColorChange}
							options={fontColors}
							placeholder='Выберите цвет текста'
						/>
					</div>

					{/* 4) Цвет фона — Select */}
					<div style={{ marginBottom: 18 }}>
						<Select
							title='Цвет фона'
							selected={formState.backgroundColor}
							onChange={handleBgColorChange}
							options={backgroundColors}
							placeholder='Выберите цвет фона'
						/>
					</div>

					{/* 5) Ширина контента — Select */}
					<div style={{ marginBottom: 18 }}>
						<Select
							title='Ширина контента'
							selected={formState.contentWidth}
							onChange={handleContentWidthChange}
							options={contentWidthArr}
							placeholder='Выберите ширину'
						/>
					</div>

					{/* Нижняя панель с кнопками */}
					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='reset'
							type='clear'
							onClick={() => handleReset()}
						/>
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
