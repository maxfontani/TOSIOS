import { COLLISION_TYPES, CollisionType } from './types';
import { CircleBody, RectangleBody } from '../geometry';
import { circleToRectangleSide, rectangleToRectangleSide } from '.';

import RBush from 'rbush';
// const RBush = require('rbush');

/**
 * A R-Tree implementation handling Rectangle and Circle bodies
 */
export class TreeCollider extends RBush<{
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    collider: string;
}> {
    // Collisions
    collidesWithRectangle(body: RectangleBody, type?: CollisionType): boolean {
        // If no collision type is specified, we just proceed with default
        if (!type) {
            return this.collides({
                minX: body.left,
                minY: body.top,
                maxX: body.right,
                maxY: body.bottom,
            });
        }

        const leaves = this.searchWithRectangle(body);
        if (!leaves || !leaves.length) {
            return false;
        }

        for (const wall of leaves) {
            if (wall.collider === 'full') {
                return true;
            }
        }

        return false;
    }

    collidesWithCircle(body: CircleBody, type?: CollisionType): boolean {
        // If no collision type is specified, we just proceed with default
        if (!type) {
            return this.collides({
                minX: body.left,
                minY: body.top,
                maxX: body.right,
                maxY: body.bottom,
            });
        }

        const leaves = this.searchWithCircle(body);
        if (!leaves || !leaves.length) {
            return false;
        }

        for (const wall of leaves) {
            if (wall.collider === 'full') {
                return true;
            }
        }

        return false;
    }

    // Searches
    searchWithRectangle(body: RectangleBody) {
        return this.search({
            minX: body.left,
            minY: body.top,
            maxX: body.right,
            maxY: body.bottom,
        });
    }

    searchWithCircle(body: CircleBody) {
        return this.search({
            minX: body.left,
            minY: body.top,
            maxX: body.right,
            maxY: body.bottom,
        });
    }

    // Corrects
    correctWithRectangle(body: RectangleBody): RectangleBody {
        const leaves = this.searchWithRectangle(body);

        if (!leaves || !leaves.length) {
            return body;
        }

        const updatedBody: RectangleBody = body.copy();
        const leafBody = new RectangleBody(0, 0, 0, 0);
        for (const wall of leaves) {
            if (!wall.collider || !COLLISION_TYPES.includes(wall.collider)) {
                continue;
            }

            leafBody.x = wall.minX;
            leafBody.y = wall.minY;
            leafBody.width = wall.maxX - wall.minX;
            leafBody.height = wall.maxY - wall.minY;

            const side = rectangleToRectangleSide(updatedBody, leafBody);
            switch (side) {
                case 'left':
                    updatedBody.right = leafBody.left;
                    break;
                case 'top':
                    updatedBody.bottom = leafBody.top;
                    break;
                case 'right':
                    updatedBody.left = leafBody.right;
                    break;
                case 'bottom':
                    updatedBody.top = leafBody.bottom;
                    break;
                default:
                    break;
            }
        }

        return updatedBody;
    }

    correctWithCircle(body: CircleBody): CircleBody {
        const leaves = this.searchWithCircle(body);

        if (!leaves || !leaves.length) {
            return body;
        }

        const updatedBody: CircleBody = body.copy();
        const leafBody = new RectangleBody(0, 0, 0, 0);
        for (const wall of leaves) {
            if (!wall.collider || !COLLISION_TYPES.includes(wall.collider)) {
                continue;
            }

            leafBody.x = wall.minX;
            leafBody.y = wall.minY;
            leafBody.width = wall.maxX - wall.minX;
            leafBody.height = wall.maxY - wall.minY;

            const side = circleToRectangleSide(body, leafBody);

            
            switch (side) {
                case 'left':
                    updatedBody.right = leafBody.left;
                    break;
                case 'top':
                    updatedBody.bottom = leafBody.top;
                    break;
                case 'right':
                    updatedBody.left = leafBody.right;
                    break;
                case 'bottom':
                    updatedBody.top = leafBody.bottom;
                    break;
                default:
                    break;
            }
        }
        return updatedBody;
    }

    noWallsAhead(xDir: number, yDir: number, body: CircleBody): boolean {
        const radius = body.radius;

        const bodyMinX = body.x - radius;
        const bodyMinY = body.y - radius;
        const bodyMaxX = body.x + radius;
        const bodyMaxY = body.y + radius;

        let direction: string;

        if (xDir) {
            xDir > 0 ? direction = 'right' : direction = 'left'
        } else {
            yDir > 0 ? direction = 'down' : direction = 'up'
        }

        if (!direction) return false

        const leaves = this.searchWithCircle(body);

        if (!leaves || !leaves.length) {
            return true;
        }

        for (const wall of leaves) {
            if (!wall.collider || !COLLISION_TYPES.includes(wall.collider)) {
                continue;
            }

            switch (direction) {
                case 'left':
                    if (wall.maxX === bodyMinX && wall.minY === bodyMinY) return false;
                    break;
                case 'up':
                    if (wall.maxY === bodyMinY && wall.minX === bodyMinX) return false;
                    break;
                case 'right':
                    if (wall.minX === bodyMaxX && wall.minY === bodyMinY) return false;
                    break;
                case 'down':
                    if (wall.minY === bodyMaxY && wall.minX === bodyMinX) return false;
                    break;
                default:
                    break;
            }
        }

        return true;
    }

    // Getters
    getAllByType(type: number): RectangleBody[] {
        const walls = this.all();
        const filtered = walls.filter((wall: any) => wall.type === type);
        const mapped = filtered.map((wall: any) => new RectangleBody(wall.minX, wall.minY, wall.maxX, wall.maxY));

        return mapped;
    }
}
