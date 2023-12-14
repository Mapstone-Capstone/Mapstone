package com.mapstone.mapstone.repositories;

import com.mapstone.mapstone.models.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
List<Comment>findAllByMap_Id(Long id);
}
