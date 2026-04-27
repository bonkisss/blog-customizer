import React, { useRef, useState, CSSProperties } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import {
	defaultArticleState,
	ArticleStateType,
} from './constants/articleProps';

import './styles/index.scss';
import styles from './styles/index.module.scss';

const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const App = () => {
	// Применённое состояние статьи
	const [articleState, setArticleState] = useState<ArticleStateType>(
		deepClone(defaultArticleState)
	);

	// Сохраняем начальное состояние страницы (при первой загрузке)
	const initialPageStateRef = useRef<ArticleStateType>(
		deepClone(defaultArticleState)
	);

	// Открыт ли сайдбар
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleToggle = () => setIsOpen((prev) => !prev);
	const handleClose = () => setIsOpen(false);

	// Apply: применить переданные из формы значения к странице
	const handleApply = (newState: ArticleStateType) => {
		setArticleState(deepClone(newState));
		// автоматически закрывать панель:
		// setIsOpen(false);
	};

	// Reset: применить переданное состояние к странице (форме)
	// (форма вызывает onReset(initialPageState) чтобы откатиться к начальному состоянию страницы)
	const handleReset = (stateToApply: ArticleStateType) => {
		setArticleState(deepClone(stateToApply));
		// закрыть панель:
		// setIsOpen(false);
	};

	return (
		<main
			className={clsx(styles.main)}
			style={
				{
					'--font-family': articleState.fontFamilyOption.value,
					'--font-size': articleState.fontSizeOption.value,
					'--font-color': articleState.fontColor.value,
					'--container-width': articleState.contentWidth.value,
					'--bg-color': articleState.backgroundColor.value,
				} as CSSProperties
			}>
			<ArticleParamsForm
				isOpen={isOpen}
				onToggle={handleToggle}
				onClose={handleClose}
				initialState={articleState} // текущее применённое состояние (для инициализации формы)
				initialPageState={initialPageStateRef.current} // начальные значения при загрузке страницы для "Сбросить"
				onApply={handleApply}
				onReset={handleReset}
			/>
			<Article />
		</main>
	);
};

export default App;
