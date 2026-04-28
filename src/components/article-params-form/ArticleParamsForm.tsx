import React, { useState } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Text } from 'src/ui/text';

import styles from './ArticleParamsForm.module.scss';
import {
	ArticleStateType,
	defaultArticleState,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
} from 'src/constants/articleProps';

type Props = {
	initialState: ArticleStateType; // текущее применённое состояние
	onApply: (s: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ initialState, onApply }: Props) => {
	// Открыт ли сайдбар
	const [isOpen, setIsOpen] = useState<boolean>(false);

	// Локальное состояние формы
	const [formState, setFormState] = useState<ArticleStateType>(initialState);

	const handleToggle = () => setIsOpen((prev) => !prev);
	const handleClose = () => setIsOpen(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onApply(formState);
	};

	// Сброс: откатываем к дефолтным параметрам и сразу применяем их
	const handleReset = (e?: React.SyntheticEvent) => {
		e?.preventDefault();
		setFormState(defaultArticleState);
		onApply(defaultArticleState);
	};

	const handleChangeField =
		<K extends keyof ArticleStateType>(key: K) =>
		(value: ArticleStateType[K]) => {
			setFormState((prev) => ({ ...prev, [key]: value }));
		};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={handleToggle} />
			{isOpen && <div className={styles.overlay} onClick={handleClose} />}

			<aside
				className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<div className={styles.title}>
						<Text as='h2' size={38} weight={800} uppercase>
							Задайте параметры
						</Text>
					</div>

					{/* 1) Семья шрифта */}
					<div className={styles.field}>
						<Select
							title='Семья шрифта'
							selected={formState.fontFamilyOption}
							onChange={handleChangeField('fontFamilyOption')}
							options={fontFamilyOptions}
							placeholder='Выберите семью шрифта'
						/>
					</div>

					{/* 2) Размер шрифта */}
					<div className={styles.field}>
						<RadioGroup
							name='font-size'
							title='Размер шрифта'
							options={fontSizeOptions}
							selected={formState.fontSizeOption}
							onChange={handleChangeField('fontSizeOption')}
						/>
					</div>

					{/* 3) Цвет текста — Select */}
					<div className={styles.field}>
						<Select
							title='Цвет текста'
							selected={formState.fontColor}
							onChange={handleChangeField('fontColor')}
							options={fontColors}
							placeholder='Выберите цвет текста'
						/>
					</div>

					{/* 4) Цвет фона — Select */}
					<div className={styles.field}>
						<Select
							title='Цвет фона'
							selected={formState.backgroundColor}
							onChange={handleChangeField('backgroundColor')}
							options={backgroundColors}
							placeholder='Выберите цвет фона'
						/>
					</div>

					{/* 5) Ширина контента — Select */}
					<div className={styles.field}>
						<Select
							title='Ширина контента'
							selected={formState.contentWidth}
							onChange={handleChangeField('contentWidth')}
							options={contentWidthArr}
							placeholder='Выберите ширину'
						/>
					</div>

					{/* Нижняя панель с кнопками */}
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
