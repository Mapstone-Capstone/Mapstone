package com.mapstone.mapstone.repositories;

import com.mapstone.mapstone.models.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
}
