<template>
	<div id="tags-view-container" @contextmenu.prevent>
		<scroll-panel
			ref="scrollPanel"
			class="tags-view-wrapper"
			@scroll="handleScroll"
		>
			<router-link
				v-for="tag in visitedViews"
				ref="tag"
				:key="tag.path"
				:class="isActive(tag) ? 'active' : ''"
				:to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
				tag="span"
				class="tags-view-item"
				@click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
				@contextmenu.prevent.native="openMenu(tag, $event)"
			>
				{{ tag.title }}
				<span
					v-if="!isAffix(tag)"
					class="el-icon-close"
					@click.prevent.stop="closeSelectedTag(tag)"
				/>
			</router-link>
		</scroll-panel>
		<div
			v-show="visible"
			:style="{ left: left + 'px', top: top + 'px' }"
			class="tags-contextmenu"
		>
			<span @click="refreshSelectedTag(selectedTag)">刷新</span>
			<span @click="closeSelectedTag(selectedTag)">关闭</span>
			<span @click="closeOthersTags()">关闭其他</span>
			<span @click="closeAllTags(selectedTag)">关闭所有</span>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import ScrollPanel from './scroll-panel.vue';

export default {
	components: {
		ScrollPanel,
	},
	data() {
		return {
			visible: false,
			top: 0,
			left: 0,
			selectedTag: {},
			routes: [],
		};
	},
	computed: {
		...mapGetters(['visitedViews']),
		container() {
			return document.querySelector('.main-container');
		},
	},
	watch: {
		$route() {
			this.addTags();
			this.moveToCurrentTag();
		},
		visible(val) {
			if (val) {
				document.body.addEventListener('click', this.closeMenu);
				this.container.addEventListener('mouseleave', this.closeMenu);
			} else {
				document.body.removeEventListener('click', this.closeMenu);
				this.container.removeEventListener('mouseleave', this.closeMenu);
			}
		},
		visitedViews: {
			handler(val) {
				sessionStorage.setItem('visitedViews', JSON.stringify(val));
			},
			deep: true,
		},
	},
	mounted() {
		this.addTags();
		this.moveToCurrentTag();
	},
	methods: {
		isAffix(tag) {
			return tag.meta && tag.meta.affix;
		},
		isActive(route) {
			return route.path === this.$route.path;
		},
		addTags() {
			const { name } = this.$route;
			if (name) {
				this.$store.dispatch('addView', this.$route);
			}
			return false;
		},
		moveToCurrentTag() {
			const tags = this.$refs.tag || [];
			this.$nextTick(() => {
				for (const tag of tags) {
					if (tag.to.path === this.$route.path) {
						this.$refs.scrollPanel.moveToTarget(tag);
						if (tag.to.fullPath !== this.$route.fullPath) {
							this.$store.commit('updateVisitedView', this.$route);
						}
						break;
					}
				}
			});
		},
		refreshSelectedTag(view) {
			this.$store.commit('delCachedView', view);
			this.$nextTick(() => {
				this.$router.replace({
					path: '/redirect' + view.fullPath,
				});
			});
		},
		closeSelectedTag(view) {
			this.$store.dispatch('delView', view).then(({ visitedViews }) => {
				if (this.isActive(view)) {
					this.toLastView(visitedViews, view);
				}
			});
		},
		closeOthersTags() {
			this.$router.push(this.selectedTag);
			this.$store.dispatch('delOthersViews', this.selectedTag);
			this.moveToCurrentTag();
		},
		closeAllTags(view) {
			this.$store.dispatch('delAllViews').then(({ visitedViews }) => {
				this.toLastView(visitedViews, view);
			});
		},
		toLastView(visitedViews, view) {
			const latestView = visitedViews.slice(-1)[0];
			if (latestView) {
				this.$router.push(latestView.fullPath);
			} else {
				if (view.name === 'index') {
					this.$router.replace({ path: view.path });
				} else {
					this.$router.push('/index');
				}
			}
		},
		openMenu(tag, e) {
			const menuMinWidth = 105;
			const offsetLeft = this.$el.getBoundingClientRect().left;
			const offsetWidth = this.$el.offsetWidth;
			const maxLeft = offsetWidth - menuMinWidth;
			const left = e.clientX - offsetLeft + 15;

			if (left > maxLeft) {
				this.left = maxLeft;
			} else {
				this.left = left;
			}

			this.top = e.clientY - 56;
			this.visible = true;
			this.selectedTag = tag;
		},
		closeMenu() {
			this.visible = false;
		},
		handleScroll() {
			this.closeMenu();
		},
	},
};
</script>

<style lang="scss" scoped>
.tags-view-wrapper {
	position: absolute;
	right: 0;
	right: 8px;
	bottom: 0;
	left: 8px;
	height: 30px;

	.tags-view-item {
		position: relative;
		display: inline-block;
		box-sizing: border-box;
		height: 100%;
		height: 26px;
		margin-top: 4px;
		margin-right: 1px;
		padding: 0 10px 0 7px;
		border-radius: 2px 13px 0px 0px;
		color: #232323;
		font-weight: 700;
		font-size: 13px;
		line-height: 26px;
		background-color: #c1c1c1;
		cursor: pointer;
		opacity: 1;

		&.active {
			height: 30px;
			margin-top: 0;
			color: #ffffff;
			line-height: 30px;
			background-color: $primary;
		}
		.el-icon-close {
			margin-right: -3px;
			margin-left: 2px;
		}
	}
}
.tags-contextmenu {
	position: absolute;
	z-index: 2000;
	margin: 0;
	padding: 3px 0;
	border-radius: 3px;
	color: #333;
	font-weight: 400;
	font-size: 12px;
	background-color: #fff;
	box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
	transition: all 0.1s;

	> span {
		display: block;
		min-width: 80px;
		margin: 0;
		padding: 7px 16px;
		text-align: center;
		cursor: pointer;

		&:hover {
			background-color: #eee;
		}
	}
}
</style>
